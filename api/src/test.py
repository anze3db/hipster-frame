import xmlrunner
import unittest
import sys

if __name__ == '__main__':
    suite = unittest.TestLoader().discover('src', '*_test.py')
    run = xmlrunner.XMLTestRunner(output='reports').run(suite)
    if not (run.wasSuccessful()):
        sys.exit(1)
